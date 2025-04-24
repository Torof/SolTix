import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { SoltixEvent } from "../target/types/soltix_event";
import { TOKEN_PROGRAM_ID, getAccount } from "@solana/spl-token";

describe("soltix-event", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoltixEvent as Program<SoltixEvent>;
  const programId = program.programId;
  
  // Generate keypairs
  const organizationOwner = anchor.web3.Keypair.generate();
  const buyer = anchor.web3.Keypair.generate();
  
  // Mock organization address
  const mockOrganization = anchor.web3.Keypair.generate().publicKey;
  
  // PDA for the event
  const [eventPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("event_data"), organizationOwner.publicKey.toBuffer()],
    programId
  );

  before(async () => {
    // Airdrop SOL to the organization and buyer
    const organizationAirdrop = await provider.connection.requestAirdrop(
      organizationOwner.publicKey,
      2000000000 // 2 SOL
    );
    await provider.connection.confirmTransaction(organizationAirdrop);
    
    const buyerAirdrop = await provider.connection.requestAirdrop(
      buyer.publicKey,
      2000000000 // 2 SOL
    );
    await provider.connection.confirmTransaction(buyerAirdrop);
  });

  it("Initializes an event", async () => {
    // Event details
    const eventName = "Test Event";
    const metadataUri = "ipfs://QmEventTest123";
    const startTime = new anchor.BN(Math.floor(Date.now() / 1000) - 3600); // 1 hour ago (for testing)
    const endTime = new anchor.BN(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now
    const totalTickets = new anchor.BN(100);
    const ticketPrice = new anchor.BN(100000000); // 0.1 SOL
    
    // Generate a keypair for the collection mint
    const collectionMint = anchor.web3.Keypair.generate();
    
    // Find PDA for collection metadata
    const [collectionMetadata] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_PROGRAM_ID.toBuffer(),
        collectionMint.publicKey.toBuffer(),
      ],
      new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s") // Metaplex program
    );
    
    // Initialize the event
    await program.methods
      .initialize(
        eventName,
        metadataUri,
        startTime,
        endTime,
        totalTickets,
        ticketPrice
      )
      .accounts({
        organization: organizationOwner.publicKey,
        eventData: eventPda,
        collectionMint: collectionMint.publicKey,
        collectionMetadata: collectionMetadata,
        tokenMetadataProgram: new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: anchor.web3.ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([organizationOwner, collectionMint])
      .rpc();
    
    // Fetch the event account
    const eventAccount = await program.account.eventData.fetch(eventPda);
    
    // Verify event data
    expect(eventAccount.name).to.equal(eventName);
    expect(eventAccount.organization.equals(organizationOwner.publicKey)).to.be.true;
    expect(eventAccount.metadataUri).to.equal(metadataUri);
    expect(eventAccount.startTime.eq(startTime)).to.be.true;
    expect(eventAccount.endTime.eq(endTime)).to.be.true;
    expect(eventAccount.totalTickets.eq(totalTickets)).to.be.true;
    expect(eventAccount.remainingTickets.eq(totalTickets)).to.be.true;
    expect(eventAccount.ticketPrice.eq(ticketPrice)).to.be.true;
    expect(eventAccount.ticketsMinted.toNumber()).to.equal(0);
    expect(eventAccount.collectionMint.equals(collectionMint.publicKey)).to.be.true;
  });

  it("Mints a ticket", async () => {
    // Generate a keypair for the ticket mint
    const ticketMint = anchor.web3.Keypair.generate();
    
    // Find PDAs for ticket metadata and master edition
    const [ticketMetadata] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_PROGRAM_ID.toBuffer(),
        ticketMint.publicKey.toBuffer(),
      ],
      new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
    );
    
    const [ticketMasterEdition] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_PROGRAM_ID.toBuffer(),
        ticketMint.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
    );
    
    // Get event data for collection mint
    const eventAccount = await program.account.eventData.fetch(eventPda);
    
    // Get buyer's token account for the ticket
    const buyerTokenAccount = await anchor.utils.token.associatedAddress({
      mint: ticketMint.publicKey,
      owner: buyer.publicKey,
    });
    
    // Get organization's balance before
    const orgBalanceBefore = await provider.connection.getBalance(organizationOwner.publicKey);
    
    // Mint the ticket
    await program.methods
      .mintTicket()
      .accounts({
        buyer: buyer.publicKey,
        organization: organizationOwner.publicKey,
        eventData: eventPda,
        ticketMint: ticketMint.publicKey,
        buyerTokenAccount: buyerTokenAccount,
        ticketMetadata: ticketMetadata,
        ticketMasterEdition: ticketMasterEdition,
        collectionMint: eventAccount.collectionMint,
        tokenMetadataProgram: new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: anchor.web3.ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      })
      .signers([buyer, ticketMint])
      .rpc();
    
    // Fetch the updated event account
    const updatedEventAccount = await program.account.eventData.fetch(eventPda);
    
    // Verify event data was updated
    expect(updatedEventAccount.ticketsMinted.toNumber()).to.equal(1);
    expect(updatedEventAccount.remainingTickets.toNumber()).to.equal(eventAccount.remainingTickets.toNumber() - 1);
    
    // Verify the buyer now owns the ticket NFT
    const buyerTokenAccountInfo = await getAccount(provider.connection, buyerTokenAccount);
    expect(Number(buyerTokenAccountInfo.amount)).to.equal(1);
    
    // Verify the organization received payment
    const orgBalanceAfter = await provider.connection.getBalance(organizationOwner.publicKey);
    expect(orgBalanceAfter - orgBalanceBefore).to.equal(eventAccount.ticketPrice.toNumber());
  });
});
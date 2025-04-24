import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { SoltixOrganization } from "../target/types/soltix_organization";

describe("soltix-organization", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoltixOrganization as Program<SoltixOrganization>;
  const programId = program.programId;
  
  // Generate keypair for organization owner
  const organizationOwner = anchor.web3.Keypair.generate();
  
  // Mock registry address for testing
  const mockRegistry = anchor.web3.Keypair.generate().publicKey;
  
  // PDA for the organization
  const [organizationPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("organization_data"), organizationOwner.publicKey.toBuffer()],
    programId
  );

  before(async () => {
    // Airdrop SOL to the organization owner
    const signature = await provider.connection.requestAirdrop(
      organizationOwner.publicKey,
      1000000000 // 1 SOL
    );
    await provider.connection.confirmTransaction(signature);
  });

  it("Initializes an organization", async () => {
    // Organization metadata
    const name = "Test Organization";
    const metadataUri = "ipfs://QmTest123456";
    
    // Initialize the organization
    await program.methods
      .initialize(name, metadataUri)
      .accounts({
        owner: organizationOwner.publicKey,
        organizationData: organizationPda,
        registry: mockRegistry,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([organizationOwner])
      .rpc();
    
    // Fetch the organization account
    const organizationAccount = await program.account.organizationData.fetch(organizationPda);
    
    // Verify account data
    expect(organizationAccount.name).to.equal(name);
    expect(organizationAccount.owner.equals(organizationOwner.publicKey)).to.be.true;
    expect(organizationAccount.metadataUri).to.equal(metadataUri);
    expect(organizationAccount.eventCount.toNumber()).to.equal(0);
    expect(organizationAccount.events).to.be.empty;
    expect(organizationAccount.registry.equals(mockRegistry)).to.be.true;
  });

  it("Updates organization metadata", async () => {
    // New metadata
    const newName = "Updated Org Name";
    const newMetadataUri = "ipfs://QmUpdated789";
    
    // Update the organization
    await program.methods
      .updateMetadata(newName, newMetadataUri)
      .accounts({
        owner: organizationOwner.publicKey,
        organizationData: organizationPda,
      })
      .signers([organizationOwner])
      .rpc();
    
    // Fetch the updated organization
    const organizationAccount = await program.account.organizationData.fetch(organizationPda);
    
    // Verify updates
    expect(organizationAccount.name).to.equal(newName);
    expect(organizationAccount.metadataUri).to.equal(newMetadataUri);
  });

  it("Creates an event", async () => {
    // Event details
    const eventName = "Test Event";
    const eventMetadataUri = "ipfs://QmEventTest123";
    const startTime = new anchor.BN(Math.floor(Date.now() / 1000) + 86400); // 1 day from now
    const endTime = new anchor.BN(Math.floor(Date.now() / 1000) + 2 * 86400); // 2 days from now
    const totalTickets = new anchor.BN(100);
    const ticketPrice = new anchor.BN(100000000); // 0.1 SOL
    
    // Find the PDA for the event
    const [eventPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("event"), 
        organizationPda.toBuffer(), 
        new anchor.BN(0).toArrayLike(Buffer, "le", 8)
      ],
      programId
    );
    
    // Create the event
    await program.methods
      .createEvent(
        eventName,
        eventMetadataUri,
        startTime,
        endTime,
        totalTickets,
        ticketPrice
      )
      .accounts({
        owner: organizationOwner.publicKey,
        organizationData: organizationPda,
        eventInfo: eventPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([organizationOwner])
      .rpc();
    
    // Fetch the organization and event
    const organizationAccount = await program.account.organizationData.fetch(organizationPda);
    const eventAccount = await program.account.eventInfo.fetch(eventPda);
    
    // Verify organization was updated
    expect(organizationAccount.eventCount.toNumber()).to.equal(1);
    expect(organizationAccount.events.length).to.equal(1);
    expect(organizationAccount.events[0].equals(eventPda)).to.be.true;
    
    // Verify event data
    expect(eventAccount.id.toNumber()).to.equal(0);
    expect(eventAccount.name).to.equal(eventName);
    expect(eventAccount.organization.equals(organizationPda)).to.be.true;
    expect(eventAccount.metadataUri).to.equal(eventMetadataUri);
    expect(eventAccount.startTime.eq(startTime)).to.be.true;
    expect(eventAccount.endTime.eq(endTime)).to.be.true;
    expect(eventAccount.totalTickets.eq(totalTickets)).to.be.true;
    expect(eventAccount.remainingTickets.eq(totalTickets)).to.be.true;
    expect(eventAccount.ticketPrice.eq(ticketPrice)).to.be.true;
  });
});
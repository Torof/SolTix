import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { SoltixRegistry } from "../target/types/soltix_registry";

describe("soltix-registry", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoltixRegistry as Program<SoltixRegistry>;
  const programId = program.programId;
  
  // Generate a new keypair for our test registry authority
  const registryAuthority = anchor.web3.Keypair.generate();
  
  // PDA for the registry
  const [registryPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("registry")],
    programId
  );

  before(async () => {
    // Airdrop SOL to our authority for transaction fees
    const signature = await provider.connection.requestAirdrop(
      registryAuthority.publicKey,
      1000000000 // 1 SOL
    );
    await provider.connection.confirmTransaction(signature);
  });

  it("Initializes the registry", async () => {
    // Initialize registry
    await program.methods
      .initialize()
      .accounts({
        authority: registryAuthority.publicKey,
        registry: registryPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([registryAuthority])
      .rpc();

    // Fetch the registry account to check if it was created
    const registryAccount = await program.account.registry.fetch(registryPda);
    
    // Verify account data
    expect(registryAccount.authority.equals(registryAuthority.publicKey)).to.be.true;
    expect(registryAccount.organizationCount.toNumber()).to.equal(0);
    expect(registryAccount.organizations).to.be.empty;
    expect(registryAccount.upcomingEvents).to.be.empty;
    expect(registryAccount.ongoingEvents).to.be.empty;
    expect(registryAccount.finishedEvents).to.be.empty;
  });

  it("Registers an organization", async () => {
    // Generate a new keypair for the organization owner
    const organizationOwner = anchor.web3.Keypair.generate();
    
    // Airdrop SOL to the organization owner
    const signature = await provider.connection.requestAirdrop(
      organizationOwner.publicKey,
      1000000000 // 1 SOL
    );
    await provider.connection.confirmTransaction(signature);
    
    // Find the PDA for the organization
    const [organizationPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("organization"), 
        new anchor.BN(0).toArrayLike(Buffer, "le", 8)
      ],
      programId
    );
    
    // Register the organization
    const orgName = "Test Organization";
    const orgDescription = "A test organization for our Solana program";
    
    await program.methods
      .registerOrganization(orgName, orgDescription)
      .accounts({
        owner: organizationOwner.publicKey,
        registry: registryPda,
        organizationInfo: organizationPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([organizationOwner])
      .rpc();
    
    // Fetch the registry and organization accounts
    const registryAccount = await program.account.registry.fetch(registryPda);
    const organizationAccount = await program.account.organizationInfo.fetch(organizationPda);
    
    // Verify registry was updated
    expect(registryAccount.organizationCount.toNumber()).to.equal(1);
    expect(registryAccount.organizations.length).to.equal(1);
    expect(registryAccount.organizations[0].equals(organizationPda)).to.be.true;
    
    // Verify organization data
    expect(organizationAccount.id.toNumber()).to.equal(0);
    expect(organizationAccount.name).to.equal(orgName);
    expect(organizationAccount.owner.equals(organizationOwner.publicKey)).to.be.true;
    expect(organizationAccount.description).to.equal(orgDescription);
    expect(organizationAccount.kycVerified).to.be.true;
  });

  it("Updates event status", async () => {
    // Create a mock event ID
    const mockEventId = anchor.web3.Keypair.generate().publicKey;
    
    // Add the event to upcoming events
    await program.methods
      .updateEventStatus(mockEventId, { upcoming: {} })
      .accounts({
        authority: registryAuthority.publicKey,
        registry: registryPda,
      })
      .signers([registryAuthority])
      .rpc();
    
    // Fetch the registry to verify
    let registryAccount = await program.account.registry.fetch(registryPda);
    expect(registryAccount.upcomingEvents.length).to.equal(1);
    expect(registryAccount.upcomingEvents[0].equals(mockEventId)).to.be.true;
    
    // Move event to ongoing
    await program.methods
      .updateEventStatus(mockEventId, { ongoing: {} })
      .accounts({
        authority: registryAuthority.publicKey,
        registry: registryPda,
      })
      .signers([registryAuthority])
      .rpc();
    
    // Verify event was moved
    registryAccount = await program.account.registry.fetch(registryPda);
    expect(registryAccount.upcomingEvents.length).to.equal(0);
    expect(registryAccount.ongoingEvents.length).to.equal(1);
    expect(registryAccount.ongoingEvents[0].equals(mockEventId)).to.be.true;
    
    // Finally move to finished
    await program.methods
      .updateEventStatus(mockEventId, { finished: {} })
      .accounts({
        authority: registryAuthority.publicKey,
        registry: registryPda,
      })
      .signers([registryAuthority])
      .rpc();
    
    // Verify event was moved to finished
    registryAccount = await program.account.registry.fetch(registryPda);
    expect(registryAccount.ongoingEvents.length).to.equal(0);
    expect(registryAccount.finishedEvents.length).to.equal(1);
    expect(registryAccount.finishedEvents[0].equals(mockEventId)).to.be.true;
  });
});
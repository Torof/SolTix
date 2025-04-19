import { EventData } from '@/components/events/EventCarousel';
import { OrganizationData } from '@/components/organizations/OrganizationGrid';

// Mock events data for demonstration
export const mockEvents: EventData[] = [
  {
    id: '1',
    name: 'Summer Music Festival',
    description: 'A three-day music festival featuring top artists from around the world. Join us for an unforgettable weekend of music, food, and fun. The festival will showcase a diverse lineup of artists spanning multiple genres, from rock and pop to electronic and hip-hop. There will also be food vendors, art installations, and interactive experiences throughout the venue.',
    startDate: '2025-06-15T18:00:00Z',
    endDate: '2025-06-17T23:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    venue: 'Central Park, New York',
    organizationId: 'org1',
    organizationName: 'Festival Productions'
  },
  {
    id: '2',
    name: 'Tech Conference 2025',
    description: 'The biggest technology conference of the year with keynotes from industry leaders. This conference will feature talks on AI, blockchain, quantum computing, and other cutting-edge technologies. Network with professionals from leading tech companies and startups. Workshops and hands-on sessions will be available for attendees looking to enhance their skills.',
    startDate: '2025-05-10T09:00:00Z',
    endDate: '2025-05-12T17:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
    venue: 'Convention Center, San Francisco',
    organizationId: 'org2',
    organizationName: 'TechEvents Inc.'
  },
  {
    id: '3',
    name: 'Art Exhibition: Modern Masters',
    description: 'An exhibition featuring works from the most influential modern artists. The exhibition brings together masterpieces from museums and private collections around the world, offering a unique opportunity to see these works in one place. Guided tours and interactive displays provide context for the artwork and artists featured.',
    startDate: '2025-04-20T10:00:00Z',
    endDate: '2025-07-15T18:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6',
    venue: 'Metropolitan Museum, New York',
    organizationId: 'org3',
    organizationName: 'Arts Foundation'
  },
  {
    id: '4',
    name: 'Food & Wine Festival',
    description: 'Sample the finest cuisine and wines from top chefs and vineyards. This culinary celebration features tastings, cooking demonstrations, and wine pairings. Meet renowned chefs and winemakers while enjoying gourmet food in a beautiful setting. Special dinners and tasting menus will be available throughout the weekend.',
    startDate: '2025-05-25T11:00:00Z',
    endDate: '2025-05-26T20:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
    venue: 'Riverside Gardens, Chicago',
    organizationId: 'org4',
    organizationName: 'Culinary Events Co.'
  },
  {
    id: '5',
    name: 'International Film Festival',
    description: 'A celebration of cinema featuring premieres and screenings from around the world. This festival showcases independent films, documentaries, and international productions. Special events include Q&A sessions with directors and actors, panel discussions on filmmaking, and workshops for aspiring filmmakers.',
    startDate: '2025-07-05T12:00:00Z',
    endDate: '2025-07-15T23:59:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26',
    venue: 'Various Theaters, Los Angeles',
    organizationId: 'org5',
    organizationName: 'Film Society'
  },
  {
    id: '6',
    name: 'Blockchain Summit',
    description: 'Connect with blockchain leaders and discover the latest in Web3 technology and applications. This summit brings together developers, entrepreneurs, investors, and enthusiasts to explore blockchain innovations. Sessions cover cryptocurrency, DeFi, NFTs, DAOs, and emerging trends in the blockchain space.',
    startDate: '2025-05-22T09:00:00Z',
    endDate: '2025-05-23T17:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05',
    venue: 'Marriott Downtown, Miami',
    organizationId: 'org6',
    organizationName: 'Blockchain Association'
  },
  {
    id: '7',
    name: 'Marathon City Run',
    description: 'Annual marathon through the heart of the city with routes for all experience levels. This event includes a full marathon, half marathon, and 5K options, making it accessible to runners of all abilities. The scenic course takes participants through historic neighborhoods and beautiful parks, with cheering stations along the route.',
    startDate: '2025-04-10T08:00:00Z',
    endDate: '2025-04-10T16:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635',
    venue: 'City Center, Boston',
    organizationId: 'org7',
    organizationName: 'City Athletics'
  },
  {
    id: '8',
    name: 'Comic Convention',
    description: 'The ultimate fan experience with celebrity guests, panels, and exclusive merchandise. This convention brings together fans of comics, movies, TV shows, and gaming. Meet your favorite creators and actors, attend exclusive panels, and shop for collectibles in the extensive exhibitor hall.',
    startDate: '2025-08-15T10:00:00Z',
    endDate: '2025-08-18T19:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806',
    venue: 'Exhibition Center, San Diego',
    organizationId: 'org8',
    organizationName: 'Comic Enterprises'
  },
  {
    id: '9',
    name: 'Jazz in the Park',
    description: 'Free outdoor jazz performances featuring local and international artists. Bring a blanket and picnic to enjoy smooth jazz under the stars. This family-friendly event showcases a diverse range of jazz styles, from traditional to contemporary fusion, performed by renowned musicians and emerging talents.',
    startDate: '2025-06-05T17:00:00Z',
    endDate: '2025-06-05T22:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae',
    venue: 'Riverside Park, New Orleans',
    organizationId: 'org9',
    organizationName: 'Jazz Heritage Foundation'
  },
  {
    id: '10',
    name: 'Startup Pitch Competition',
    description: 'Emerging entrepreneurs present their ideas to investors and compete for funding. Watch as innovative startups pitch their business concepts to a panel of venture capitalists and angel investors. The competition includes Q&A sessions, networking opportunities, and workshops on entrepreneurship and fundraising.',
    startDate: '2025-05-18T13:00:00Z',
    endDate: '2025-05-18T20:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17',
    venue: 'Innovation Hub, Austin',
    organizationId: 'org10',
    organizationName: 'Venture Capital Group'
  },
  {
    id: '11',
    name: 'Virtual Reality Expo',
    description: 'Experience the latest in VR/AR technology with demonstrations and workshops. Try out cutting-edge VR headsets, AR applications, and immersive experiences. Industry experts will lead sessions on the future of virtual and augmented reality in gaming, education, healthcare, and enterprise applications.',
    startDate: '2025-09-12T10:00:00Z',
    endDate: '2025-09-14T18:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620',
    venue: 'Tech Campus, Seattle',
    organizationId: 'org11',
    organizationName: 'Future Technology Association'
  },
  {
    id: '12',
    name: 'Craft Beer Festival',
    description: 'Sample over 100 craft beers from local and international breweries. This festival celebrates the art of brewing with tastings of IPAs, stouts, sours, and more. Meet brewers, learn about the brewing process, and enjoy food pairings that complement different beer styles.',
    startDate: '2025-07-20T12:00:00Z',
    endDate: '2025-07-20T22:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1575367439058-6096bb9cf5e2',
    venue: 'Waterfront Park, Portland',
    organizationId: 'org12',
    organizationName: 'Craft Brewers Guild'
  }
];

export const mockOrganizations: OrganizationData[] = [
    {
      id: 'org1',
      name: 'Festival Productions',
      description: 'Premier music festival producer with events around the world.',
      logoUrl: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f',
      bannerUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
      website: 'https://example.com/festival',
      owner: 'AncN1M1QdRe2gy9DQ1zDy4wMqAMEBTP6pJLMkVTSvCWs'
    },
    {
      id: 'org2',
      name: 'TechEvents Inc.',
      description: 'Bringing the latest technology trends to conferences worldwide.',
      logoUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095',
      bannerUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4',
      website: 'https://example.com/techevents',
      owner: 'ByfZ4LQuNZo1KAMCikZ55qHPx1z3JmrA4vTr2jnj4xSu'
    },
    {
      id: 'org3',
      name: 'Arts Foundation',
      description: 'Supporting arts and cultural exhibitions in major cities.',
      logoUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
      bannerUrl: 'https://images.unsplash.com/photo-1577083552761-4a44cbc0f171',
      website: 'https://example.com/artsfoundation',
      owner: 'DFxPZssUcvgC1VTeRs26uohZ7YwUqxMYHpZ1q1vPo3nV'
    },
    {
      id: 'org4',
      name: 'Culinary Events Co.',
      description: 'Food and wine festivals featuring renowned chefs and cuisines.',
      logoUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1',
      bannerUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033',
      website: 'https://example.com/culinary',
      owner: 'EJKQaMsMvkhRGJDHdHnRXYZxTZpC4Y6uqT5oJ7BwEVrA'
    },
    {
      id: 'org5',
      name: 'Film Society',
      description: 'Celebrating cinema through festivals, screenings, and filmmaker events.',
      logoUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728',
      bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
      website: 'https://example.com/filmsociety',
      owner: 'FfYZs7g9xSvYd7JL3JhwJhwGwSGD6yLDmkZoSZMjVpAR'
    },
    {
      id: 'org6',
      name: 'Blockchain Association',
      description: 'Bringing together blockchain enthusiasts and experts for networking and education.',
      logoUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55',
      bannerUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0',
      website: 'https://example.com/blockchain',
      owner: 'G6vHMcYM2Wu7FjAdMcWpB3wySdjh4JMgVz7S94pm1nrD'
    }
  ];
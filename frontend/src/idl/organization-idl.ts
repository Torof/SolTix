export type SoltixOrganization = {
    "version": "0.1.0",
    "name": "soltix_organization",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "organization",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          }
        ]
      },
      {
        "name": "updateMetadata",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "organization",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          }
        ]
      },
      {
        "name": "createEvent",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "organization",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "event",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "registryProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "registry",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "eventsRegistry",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "location",
            "type": "string"
          },
          {
            "name": "date",
            "type": "i64"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "maxCapacity",
            "type": "u32"
          },
          {
            "name": "ticketMetadataUri",
            "type": "string"
          }
        ]
      },
      {
        "name": "updateEventStatus",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "event",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "organization",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "registryProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "registry",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "eventsRegistry",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "newStatus",
            "type": "u8"
          }
        ]
      },
      {
        "name": "updateEventCapacity",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "event",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "increment",
            "type": "bool"
          }
        ]
      },
      {
        "name": "verifyTicket",
        "accounts": [
          {
            "name": "owner",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "event",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ticket",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ticketOwner",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "registerWithRegistry",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "organization",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "registryProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "registry",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "organizationInfo",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "Organization",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "metadataUri",
              "type": "string"
            },
            {
              "name": "eventCount",
              "type": "u64"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "Event",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "organization",
              "type": "publicKey"
            },
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "description",
              "type": "string"
            },
            {
              "name": "location",
              "type": "string"
            },
            {
              "name": "date",
              "type": "i64"
            },
            {
              "name": "price",
              "type": "u64"
            },
            {
              "name": "maxCapacity",
              "type": "u32"
            },
            {
              "name": "currentCapacity",
              "type": "u32"
            },
            {
              "name": "ticketMetadataUri",
              "type": "string"
            },
            {
              "name": "soldOut",
              "type": "bool"
            },
            {
              "name": "status",
              "type": "u8"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "Unauthorized",
        "msg": "Unauthorized access"
      },
      {
        "code": 6001,
        "name": "InvalidName",
        "msg": "Invalid organization name"
      },
      {
        "code": 6002,
        "name": "OrganizationNotFound",
        "msg": "Organization not found"
      },
      {
        "code": 6003,
        "name": "EventNotFound",
        "msg": "Event not found"
      },
      {
        "code": 6004,
        "name": "EventAtCapacity",
        "msg": "Event is at maximum capacity"
      },
      {
        "code": 6005,
        "name": "EventEnded",
        "msg": "Event has already ended"
      },
      {
        "code": 6006,
        "name": "InvalidMetadataUri",
        "msg": "Invalid metadata URI"
      },
      {
        "code": 6007,
        "name": "InvalidEventDate",
        "msg": "Event date is in the past"
      }
    ]
  };
  
  export const IDL: SoltixOrganization = {
    "version": "0.1.0",
    "name": "soltix_organization",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "organization",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          }
        ]
      },
      {
        "name": "updateMetadata",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "organization",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          }
        ]
      },
      {
        "name": "createEvent",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "organization",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "event",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "registryProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "registry",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "eventsRegistry",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "location",
            "type": "string"
          },
          {
            "name": "date",
            "type": "i64"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "maxCapacity",
            "type": "u32"
          },
          {
            "name": "ticketMetadataUri",
            "type": "string"
          }
        ]
      },
      {
        "name": "updateEventStatus",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "event",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "organization",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "registryProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "registry",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "eventsRegistry",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "newStatus",
            "type": "u8"
          }
        ]
      },
      {
        "name": "updateEventCapacity",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "event",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "increment",
            "type": "bool"
          }
        ]
      },
      {
        "name": "verifyTicket",
        "accounts": [
          {
            "name": "owner",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "event",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ticket",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ticketOwner",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "registerWithRegistry",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "organization",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "registryProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "registry",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "organizationInfo",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "Organization",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "metadataUri",
              "type": "string"
            },
            {
              "name": "eventCount",
              "type": "u64"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "Event",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "organization",
              "type": "publicKey"
            },
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "description",
              "type": "string"
            },
            {
              "name": "location",
              "type": "string"
            },
            {
              "name": "date",
              "type": "i64"
            },
            {
              "name": "price",
              "type": "u64"
            },
            {
              "name": "maxCapacity",
              "type": "u32"
            },
            {
              "name": "currentCapacity",
              "type": "u32"
            },
            {
              "name": "ticketMetadataUri",
              "type": "string"
            },
            {
              "name": "soldOut",
              "type": "bool"
            },
            {
              "name": "status",
              "type": "u8"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "Unauthorized",
        "msg": "Unauthorized access"
      },
      {
        "code": 6001,
        "name": "InvalidName",
        "msg": "Invalid organization name"
      },
      {
        "code": 6002,
        "name": "OrganizationNotFound",
        "msg": "Organization not found"
      },
      {
        "code": 6003,
        "name": "EventNotFound",
        "msg": "Event not found"
      },
      {
        "code": 6004,
        "name": "EventAtCapacity",
        "msg": "Event is at maximum capacity"
      },
      {
        "code": 6005,
        "name": "EventEnded",
        "msg": "Event has already ended"
      },
      {
        "code": 6006,
        "name": "InvalidMetadataUri",
        "msg": "Invalid metadata URI"
      },
      {
        "code": 6007,
        "name": "InvalidEventDate",
        "msg": "Event date is in the past"
      }
    ]
  };
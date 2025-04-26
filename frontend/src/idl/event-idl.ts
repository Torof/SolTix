export type SoltixEvent = {
    "version": "0.1.0",
    "name": "soltix_event",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "eventManager",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "createTicket",
        "accounts": [
          {
            "name": "buyer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "eventManager",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "event",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ticket",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "buyerTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "eventTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "organizationProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "eventId",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "useTicket",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "eventManager",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ticket",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "event",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "buyer",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "refundTicket",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "eventManager",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ticket",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "event",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "buyer",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "buyerTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "eventTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "organizationProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "EventManager",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "ticketCount",
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
        "name": "Ticket",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "buyer",
              "type": "publicKey"
            },
            {
              "name": "event",
              "type": "publicKey"
            },
            {
              "name": "eventId",
              "type": "publicKey"
            },
            {
              "name": "used",
              "type": "bool"
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
        "name": "TicketAlreadyUsed",
        "msg": "Ticket already used"
      },
      {
        "code": 6002,
        "name": "EventSoldOut",
        "msg": "Event is sold out"
      },
      {
        "code": 6003,
        "name": "EventEnded",
        "msg": "Event has already ended"
      },
      {
        "code": 6004,
        "name": "InvalidEventId",
        "msg": "Invalid event ID"
      },
      {
        "code": 6005,
        "name": "InsufficientPayment",
        "msg": "Insufficient payment"
      },
      {
        "code": 6006,
        "name": "InvalidTicketOwner",
        "msg": "Invalid ticket owner"
      }
    ]
  };
  
  export const IDL: SoltixEvent = {
    "version": "0.1.0",
    "name": "soltix_event",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "eventManager",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "createTicket",
        "accounts": [
          {
            "name": "buyer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "eventManager",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "event",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ticket",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "buyerTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "eventTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "organizationProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "eventId",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "useTicket",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "eventManager",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ticket",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "event",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "buyer",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "refundTicket",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "eventManager",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ticket",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "event",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "buyer",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "buyerTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "eventTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "organizationProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "EventManager",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "ticketCount",
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
        "name": "Ticket",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "buyer",
              "type": "publicKey"
            },
            {
              "name": "event",
              "type": "publicKey"
            },
            {
              "name": "eventId",
              "type": "publicKey"
            },
            {
              "name": "used",
              "type": "bool"
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
        "name": "TicketAlreadyUsed",
        "msg": "Ticket already used"
      },
      {
        "code": 6002,
        "name": "EventSoldOut",
        "msg": "Event is sold out"
      },
      {
        "code": 6003,
        "name": "EventEnded",
        "msg": "Event has already ended"
      },
      {
        "code": 6004,
        "name": "InvalidEventId",
        "msg": "Invalid event ID"
      },
      {
        "code": 6005,
        "name": "InsufficientPayment",
        "msg": "Insufficient payment"
      },
      {
        "code": 6006,
        "name": "InvalidTicketOwner",
        "msg": "Invalid ticket owner"
      }
    ]
  };
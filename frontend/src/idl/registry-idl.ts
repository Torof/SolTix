export type SoltixRegistry = {
    "version": "0.1.0",
    "name": "soltix_registry",
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
            "name": "registry",
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
        "name": "initializeEvents",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "registry",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "eventsRegistry",
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
        "name": "registerOrganization",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "registry",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "organizationInfo",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "orgProgram",
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
      },
      {
        "name": "updateEventStatus",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "registry",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "eventsRegistry",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "eventId",
            "type": "publicKey"
          },
          {
            "name": "newStatus",
            "type": {
              "defined": "EventStatus"
            }
          }
        ]
      },
      {
        "name": "registerEvent",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "registry",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "eventsRegistry",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "event",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "eventId",
            "type": "publicKey"
          }
        ]
      },
      {
        "name": "updateEventStatusesByTime",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "registry",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "eventsRegistry",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "Registry",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "organizationCount",
              "type": "u64"
            },
            {
              "name": "organizationCountAdded",
              "type": "u64"
            },
            {
              "name": "organizations",
              "type": {
                "array": [
                  "publicKey",
                  1
                ]
              }
            },
            {
              "name": "eventsAccount",
              "type": "publicKey"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "EventsRegistry",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "upcomingEventCount",
              "type": "u64"
            },
            {
              "name": "upcomingEvents",
              "type": {
                "array": [
                  "publicKey",
                  1
                ]
              }
            },
            {
              "name": "ongoingEventCount",
              "type": "u64"
            },
            {
              "name": "ongoingEvents",
              "type": {
                "array": [
                  "publicKey",
                  1
                ]
              }
            },
            {
              "name": "finishedEventCount",
              "type": "u64"
            },
            {
              "name": "finishedEvents",
              "type": {
                "array": [
                  "publicKey",
                  1
                ]
              }
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "OrganizationInfo",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "id",
              "type": "u64"
            },
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "description",
              "type": "string"
            },
            {
              "name": "kycVerified",
              "type": "bool"
            },
            {
              "name": "orgProgramId",
              "type": "publicKey"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "EventStatus",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "Upcoming"
            },
            {
              "name": "Ongoing"
            },
            {
              "name": "Finished"
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
        "name": "NameTooLong",
        "msg": "Organization name is too long"
      },
      {
        "code": 6002,
        "name": "DescriptionTooLong",
        "msg": "Organization description is too long"
      },
      {
        "code": 6003,
        "name": "RegistryFull",
        "msg": "Registry is full"
      },
      {
        "code": 6004,
        "name": "CategoryFull",
        "msg": "Event category is full"
      },
      {
        "code": 6005,
        "name": "EventNotFound",
        "msg": "Event not found"
      },
      {
        "code": 6006,
        "name": "OrganizationNotFound",
        "msg": "Organization not found"
      },
      {
        "code": 6007,
        "name": "InvalidEventStatus",
        "msg": "Invalid event status"
      }
    ]
  };
  
  export const IDL: SoltixRegistry = {
    "version": "0.1.0",
    "name": "soltix_registry",
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
            "name": "registry",
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
        "name": "initializeEvents",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "registry",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "eventsRegistry",
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
        "name": "registerOrganization",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "registry",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "organizationInfo",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "orgProgram",
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
      },
      {
        "name": "updateEventStatus",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "registry",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "eventsRegistry",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "eventId",
            "type": "publicKey"
          },
          {
            "name": "newStatus",
            "type": {
              "defined": "EventStatus"
            }
          }
        ]
      },
      {
        "name": "registerEvent",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "registry",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "eventsRegistry",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "event",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "eventId",
            "type": "publicKey"
          }
        ]
      },
      {
        "name": "updateEventStatusesByTime",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "registry",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "eventsRegistry",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "Registry",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "organizationCount",
              "type": "u64"
            },
            {
              "name": "organizationCountAdded",
              "type": "u64"
            },
            {
              "name": "organizations",
              "type": {
                "array": [
                  "publicKey",
                  1
                ]
              }
            },
            {
              "name": "eventsAccount",
              "type": "publicKey"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "EventsRegistry",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "upcomingEventCount",
              "type": "u64"
            },
            {
              "name": "upcomingEvents",
              "type": {
                "array": [
                  "publicKey",
                  1
                ]
              }
            },
            {
              "name": "ongoingEventCount",
              "type": "u64"
            },
            {
              "name": "ongoingEvents",
              "type": {
                "array": [
                  "publicKey",
                  1
                ]
              }
            },
            {
              "name": "finishedEventCount",
              "type": "u64"
            },
            {
              "name": "finishedEvents",
              "type": {
                "array": [
                  "publicKey",
                  1
                ]
              }
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "OrganizationInfo",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "id",
              "type": "u64"
            },
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "description",
              "type": "string"
            },
            {
              "name": "kycVerified",
              "type": "bool"
            },
            {
              "name": "orgProgramId",
              "type": "publicKey"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "EventStatus",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "Upcoming"
            },
            {
              "name": "Ongoing"
            },
            {
              "name": "Finished"
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
        "name": "NameTooLong",
        "msg": "Organization name is too long"
      },
      {
        "code": 6002,
        "name": "DescriptionTooLong",
        "msg": "Organization description is too long"
      },
      {
        "code": 6003,
        "name": "RegistryFull",
        "msg": "Registry is full"
      },
      {
        "code": 6004,
        "name": "CategoryFull",
        "msg": "Event category is full"
      },
      {
        "code": 6005,
        "name": "EventNotFound",
        "msg": "Event not found"
      },
      {
        "code": 6006,
        "name": "OrganizationNotFound",
        "msg": "Organization not found"
      },
      {
        "code": 6007,
        "name": "InvalidEventStatus",
        "msg": "Invalid event status"
      }
    ]
  };
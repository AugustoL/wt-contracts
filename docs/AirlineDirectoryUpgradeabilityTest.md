* [AirlineDirectoryUpgradeabilityTest](#airlinedirectoryupgradeabilitytest)
  * [getAirlines](#function-getairlines)
  * [organizationsByOwnerDeprecated](#function-organizationsbyownerdeprecated)
  * [newFunction](#function-newfunction)
  * [addAirline](#function-addairline)
  * [airlines](#function-airlines)
  * [initialize](#function-initialize)
  * [LifToken](#function-liftoken)
  * [createAndAddAirline](#function-createandaddairline)
  * [organizationsByOwnerIndexDeprecated](#function-organizationsbyownerindexdeprecated)
  * [organizationsIndex](#function-organizationsindex)
  * [owner](#function-owner)
  * [getOrganizations](#function-getorganizations)
  * [getAirlinesLength](#function-getairlineslength)
  * [removeAirline](#function-removeairline)
  * [createAirline](#function-createairline)
  * [getOrganizationsLength](#function-getorganizationslength)
  * [airlinesIndex](#function-airlinesindex)
  * [organizations](#function-organizations)
  * [setLifToken](#function-setliftoken)
  * [transferOwnership](#function-transferownership)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationAdded](#event-organizationadded)
  * [OrganizationRemoveed](#event-organizationremoveed)
  * [OwnershipTransferred](#event-ownershiptransferred)

# AirlineDirectoryUpgradeabilityTest


## *function* getAirlines

AirlineDirectoryUpgradeabilityTest.getAirlines() `view` `0d5dc054`

> `getAirlines` proxies getOrganizations



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* organizationsByOwnerDeprecated

AirlineDirectoryUpgradeabilityTest.organizationsByOwnerDeprecated(, ) `view` `18531bb6`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* newFunction

AirlineDirectoryUpgradeabilityTest.newFunction() `pure` `1b28d63e`





## *function* addAirline

AirlineDirectoryUpgradeabilityTest.addAirline(airline) `nonpayable` `3a0295d1`

> `addAirline` proxies and externalizes addOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | Airline's address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* airlines

AirlineDirectoryUpgradeabilityTest.airlines(index) `view` `3a9a77ca`

> `airlines` aliases organizations

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | Airline's index |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* initialize

AirlineDirectoryUpgradeabilityTest.initialize(__owner, _lifToken) `nonpayable` `485cc955`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _lifToken | The new contract address |


## *function* LifToken

AirlineDirectoryUpgradeabilityTest.LifToken() `view` `554d8b37`





## *function* createAndAddAirline

AirlineDirectoryUpgradeabilityTest.createAndAddAirline(dataUri) `nonpayable` `59a4507a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* organizationsByOwnerIndexDeprecated

AirlineDirectoryUpgradeabilityTest.organizationsByOwnerIndexDeprecated() `view` `5bb087d8`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* organizationsIndex

AirlineDirectoryUpgradeabilityTest.organizationsIndex() `view` `63cd48fb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* owner

AirlineDirectoryUpgradeabilityTest.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* getOrganizations

AirlineDirectoryUpgradeabilityTest.getOrganizations() `view` `9754a3a8`

> `getOrganizations` get `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* getAirlinesLength

AirlineDirectoryUpgradeabilityTest.getAirlinesLength() `view` `98696eb5`

> `getAirlinesLength` proxies getOrganizationsLength



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* removeAirline

AirlineDirectoryUpgradeabilityTest.removeAirline(airline) `nonpayable` `a4945e84`

> `removeAirline` proxies and externalizes removeOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | Airline's address |


## *function* createAirline

AirlineDirectoryUpgradeabilityTest.createAirline(dataUri) `nonpayable` `b260c10a`

> `createAirline` proxies and externalizes createOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | Airline's data pointer |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* getOrganizationsLength

AirlineDirectoryUpgradeabilityTest.getOrganizationsLength() `view` `b9306681`

> `getOrganizationsLength` get the length of the `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* airlinesIndex

AirlineDirectoryUpgradeabilityTest.airlinesIndex(airline) `view` `c73f2bfb`

> `airlinesIndex` aliases organizatoinsIndex 

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | Airline's address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* organizations

AirlineDirectoryUpgradeabilityTest.organizations() `view` `e792dd8a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* setLifToken

AirlineDirectoryUpgradeabilityTest.setLifToken(_lifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract. Allows to set the address to zero address

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lifToken | The new contract address |


## *function* transferOwnership

AirlineDirectoryUpgradeabilityTest.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |

## *event* OrganizationCreated

AirlineDirectoryUpgradeabilityTest.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationAdded

AirlineDirectoryUpgradeabilityTest.OrganizationAdded(organization, index) `424a91ec`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationRemoveed

AirlineDirectoryUpgradeabilityTest.OrganizationRemoveed(organization) `3325ef95`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

AirlineDirectoryUpgradeabilityTest.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
* [AbstractWTHotelIndex](#abstractwthotelindex)
  * [getHotels](#function-gethotels)
  * [callHotel](#function-callhotel)
  * [hotelsByManagerIndex](#function-hotelsbymanagerindex)
  * [transferHotel](#function-transferhotel)
  * [version](#function-version)
  * [LifToken](#function-liftoken)
  * [renounceOwnership](#function-renounceownership)
  * [hotelsByManager](#function-hotelsbymanager)
  * [owner](#function-owner)
  * [hotelsIndex](#function-hotelsindex)
  * [getHotelsByManager](#function-gethotelsbymanager)
  * [getHotelsLength](#function-gethotelslength)
  * [contractType](#function-contracttype)
  * [hotels](#function-hotels)
  * [transferOwnership](#function-transferownership)
  * [registerHotel](#function-registerhotel)
  * [deleteHotel](#function-deletehotel)
  * [HotelRegistered](#event-hotelregistered)
  * [HotelDeleted](#event-hoteldeleted)
  * [HotelCalled](#event-hotelcalled)
  * [HotelTransferred](#event-hoteltransferred)
  * [OwnershipRenounced](#event-ownershiprenounced)
  * [OwnershipTransferred](#event-ownershiptransferred)

# AbstractWTHotelIndex


## *function* getHotels

AbstractWTHotelIndex.getHotels() `view` `0d2e677a`





## *function* callHotel

AbstractWTHotelIndex.callHotel(hotel, data) `nonpayable` `154d56db`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | undefined |
| *bytes* | data | undefined |


## *function* hotelsByManagerIndex

AbstractWTHotelIndex.hotelsByManagerIndex() `view` `189f6aef`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* transferHotel

AbstractWTHotelIndex.transferHotel(hotel, newManager) `nonpayable` `292d64e0`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | undefined |
| *address* | newManager | undefined |


## *function* version

AbstractWTHotelIndex.version() `view` `54fd4d50`





## *function* LifToken

AbstractWTHotelIndex.LifToken() `view` `554d8b37`





## *function* renounceOwnership

AbstractWTHotelIndex.renounceOwnership() `nonpayable` `715018a6`

**Renouncing to ownership will leave the contract without an owner. It will not be possible to call the functions with the `onlyOwner` modifier anymore.**

> Allows the current owner to relinquish control of the contract.




## *function* hotelsByManager

AbstractWTHotelIndex.hotelsByManager(, ) `view` `7cf2dfae`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* owner

AbstractWTHotelIndex.owner() `view` `8da5cb5b`





## *function* hotelsIndex

AbstractWTHotelIndex.hotelsIndex() `view` `9f9bfeb8`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* getHotelsByManager

AbstractWTHotelIndex.getHotelsByManager(manager) `view` `bb979c3d`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | manager | undefined |


## *function* getHotelsLength

AbstractWTHotelIndex.getHotelsLength() `view` `ca63a55b`





## *function* contractType

AbstractWTHotelIndex.contractType() `view` `cb2ef6f7`





## *function* hotels

AbstractWTHotelIndex.hotels() `view` `cd338265`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* transferOwnership

AbstractWTHotelIndex.transferOwnership(_newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _newOwner | The address to transfer ownership to. |


## *function* registerHotel

AbstractWTHotelIndex.registerHotel(dataUri) `nonpayable` `f88a067f`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* deleteHotel

AbstractWTHotelIndex.deleteHotel(hotel) `nonpayable` `fb6f6875`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | undefined |

## *event* HotelRegistered

AbstractWTHotelIndex.HotelRegistered(hotel, managerIndex, allIndex) `48ef5bfc`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | not indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* HotelDeleted

AbstractWTHotelIndex.HotelDeleted(hotel, managerIndex, allIndex) `54f58abd`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | not indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* HotelCalled

AbstractWTHotelIndex.HotelCalled(hotel) `e09d7761`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | not indexed |

## *event* HotelTransferred

AbstractWTHotelIndex.HotelTransferred(hotel, previousManager, newManager) `04dd8111`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | not indexed |
| *address* | previousManager | not indexed |
| *address* | newManager | not indexed |

## *event* OwnershipRenounced

AbstractWTHotelIndex.OwnershipRenounced(previousOwner) `f8df3114`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |

## *event* OwnershipTransferred

AbstractWTHotelIndex.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
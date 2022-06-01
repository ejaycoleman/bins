import { Arg, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { addressLookup } from '@joshbalfour/canterbury-api'

import { Address } from '../entities/address'
import { Bin } from '../entities/bin'
import { AppDataSource } from '../data-source'
import { updateAddressData } from '../data-update'

@Resolver(Address)
export class AddressLookupResolver {
  @Query(() => [Address])
  async addressLookup(@Arg('postcode') postcode: string): Promise<Omit<Address, 'bins'>[]> {
    const addressRepository = AppDataSource.getRepository(Address)
    let addresses = await addressRepository.find({
      where: {
        postcode,
      },
    })
    if (!addresses.length){
      const results = await addressLookup(postcode)
      const storableAddresses = results.candidates
          .map(address => {
            const storableAddress = {
              formatted: address.address,
              postcode: address.attributes.POSTCODE,
              firstLine: address.address.split(',')[0],
              data: address.attributes,
              supported: false,
            }
            return storableAddress
          })
      addresses = await addressRepository.save(addressRepository.create(storableAddresses))
    }
    return addresses
  }

  @Query(() => Address)
  async addressLookupById(@Arg('addressId') addressId: string): Promise<Omit<Address, 'bins'>> {
    const addressRepository = AppDataSource.getRepository(Address)
    const address = await addressRepository.findOne({
      where: {
        id: addressId,
      },
    })
    if (!address) {
      throw new Error('Address not found')
    }
    return address
  }

  @FieldResolver()
  async bins (@Root() address: Address): Promise<Bin[]> {
    const binRepository = AppDataSource.getRepository(Bin)
    let bins = await binRepository.find({
      where: {
        address: {
          id: address.id,
        }
      },
    })

    if (bins.length) {
      return bins
    }

    await updateAddressData(address)

    return binRepository.find({
      where: {
        address: {
          id: address.id,
        }
      },
    })
  }
}

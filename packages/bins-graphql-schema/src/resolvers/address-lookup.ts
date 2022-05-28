import { Arg, Query, Resolver } from 'type-graphql'

import { addressLookup } from '@joshbalfour/canterbury-api'
import { Address } from '../entities/address'

@Resolver(Address)
export class AddressLookupResolver {
  @Query(() => [Address])
  async addressLookup(@Arg('postcode') postcode: string): Promise<Address[]> {
    const addresses = await addressLookup(postcode)

    return addresses.candidates.map(address => ({
      id: `${address.attributes.UPRN}-${address.attributes.USRN}`,
      formatted: address.address,
      postcode: address.attributes.POSTCODE,
      firstLine: address.address.split(',')[0],
    }))
  }

  // todo
  @Query(() => Address)
  async addressLookupById(@Arg('addressId') addressId: string): Promise<Address> {
    const [uprn, usrn] = addressId.split('-')
    // lookup in cache
    return {
      id: addressId,
      formatted: 'Flat 12, 3 Allgood Street, London, SW1A 2AA',
      postcode: 'SW1A 2AA',
      firstLine: 'Flat 12, 3 Allgood Street',
    } as Address
  }
}

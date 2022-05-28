import { Arg, Mutation, Query, Resolver } from 'type-graphql'

import { findCollectionDates, CollectionDates, BinType, binTypes, reportMissed, getReportMissedUrl } from '@joshbalfour/canterbury-api'
import { Bin, ReportMissedCollection } from '../entities/bin'
import { AddressLookupResolver } from './address-lookup'

export const notEmpty = <TValue>(value?: TValue | null): value is TValue => {
  return value !== null && value !== undefined
}

const getBins = (addressId: string, binInfo: CollectionDates): Bin[] => {
  // group by bin
  const { dates, status } = binInfo
  const { blackBinDay, foodBinDay, gardenBinDay, recyclingBinDay } = dates
  const binDates = new Map<BinType, Date[]>()
  binDates.set('General', blackBinDay)
  binDates.set('Food', foodBinDay)
  binDates.set('Garden', gardenBinDay)
  binDates.set('Recycling', recyclingBinDay)

  return binTypes.map(type => {
    const statuses = status?.streetStatus.filter(s => s.type === type)
    const [currentStatus] = statuses?.sort((a, b) => {
      return b.date.getTime() - a.date.getTime()
    }) || []

    const collectionDates = binDates.get(type)
    if (!collectionDates || !collectionDates.length) {
      return undefined
    }
    const binId = `${addressId}-${type}`
    return ({
      type,
      id: binId,
      collections: collectionDates,
      status: currentStatus && {
        outcome: currentStatus.outcome,
        date: currentStatus.date,
        id: `${binId}-${currentStatus.workpack}`,
      },
    })
  }).filter(notEmpty)
}

@Resolver(Bin)
export class BinResolver {
  @Query(() => [Bin])
  async findBinsForAddress(@Arg('addressId') addressId: string): Promise<Bin[]> {
    const [uprn, usrn] = addressId.split('-')
    const results = await findCollectionDates(uprn, usrn)

    return getBins(addressId, results)
  }

  @Mutation(() => Bin)
  async reportMissedCollection(
    @Arg('binId') binId: string,
    @Arg('email') emailAddress: string,
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
  ): Promise<ReportMissedCollection> {
    const [uprn, usrn, type] = binId.split('-')
    const addressId = `${uprn}-${usrn}`
    const results = await this.findBinsForAddress(addressId)
    const binInfo = results.find(b => b.type === type)
    if (!binInfo) {
      throw new Error(`Could not find bin ${binId}`)
    }
    if (!binInfo.status) {
      throw new Error(`Bin ${binId} has no status`)
    }
    const [,,workpack] = binInfo.status.id.split(':')
    const { postcode, firstLine } = await (new AddressLookupResolver()).addressLookupById(addressId)

    const fallbackUrl = getReportMissedUrl({
      uprn,
      workpack,
      bin: type as BinType,
      postcode,
      firstLine,
    })

    try {
      await reportMissed({
        uprn,
        workpack,
        bin: type as BinType,
        postcode,
        firstLine,
        emailAddress,
        firstName,
        lastName,
      })
  
      return {
        success: true,
        fallbackUrl,
      }
    } catch (e) {
      console.error(e)
    }

    return {
      success: false,
      fallbackUrl,
    }
  }
}

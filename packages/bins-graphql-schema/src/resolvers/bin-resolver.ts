import { Arg, FieldResolver, Mutation, Resolver, Root } from 'type-graphql'
import { AppDataSource } from '../data-source'

import { Bin, ReportMissedCollection } from '../entities/bin'
import { BinStatus } from '../entities/bin-status'
import { reportMissedCollection } from '../mappers/report-missed-collection'
import dayjs from 'dayjs'

@Resolver(Bin)
export class BinResolver {
  @Mutation(() => Bin)
  async reportMissedCollection(
    @Arg('binId') binId: string,
    @Arg('email') emailAddress: string,
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string
  ): Promise<ReportMissedCollection> {
    const binRepository = AppDataSource.getRepository(Bin)
    const bin = await binRepository.findOne({
      where: {
        id: binId,
      },
      relations: ['address'],
    })
    if (!bin) {
      throw new Error('Bin not found')
    }
    return reportMissedCollection(bin, { emailAddress, firstName, lastName })
  }

  @FieldResolver()
  status(@Root() bin: Bin): BinStatus {
    const statuses = bin.statusHistory.sort((a, b) => {
      return dayjs(a.date).isBefore(b.date) ? 1 : -1
    })
    return statuses[0]
  }

  @FieldResolver()
  collections (@Root() bin: Bin): Date[] {
    return bin.collectionDates.map(c => c.date)
  }
}

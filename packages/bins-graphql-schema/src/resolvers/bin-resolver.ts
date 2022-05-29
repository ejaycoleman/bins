import { Arg, Mutation, Resolver } from 'type-graphql'
import { AppDataSource } from '../data-source'

import { Bin, ReportMissedCollection } from '../entities/bin'
import { reportMissedCollection } from '../mappers/report-missed-collection'

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
}

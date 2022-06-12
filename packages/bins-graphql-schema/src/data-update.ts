import { In } from "typeorm"
import { AppDataSource } from "./data-source"
import { Address, Bin, BinCollection, BinStatus } from "./entities"
import { findCollectionDates } from "./mappers/collection-dates"

const diffStatuses = (bins: Bin[], a: BinStatus[], b: BinStatus[]) => {
  const statusChanges: BinStatus[] = []

  bins.forEach(bin => {
    const aStatus = a.filter(status => status.bin.id === bin.id).sort((a, b) => {
      return b.date > a.date ? -1 : 1
    })[0]
    const bStatus = b.filter(status => status.bin.id === bin.id).sort((a, b) => {
      return b.date > a.date ? -1 : 1
    })[0]
    if (aStatus && bStatus) {
      if (aStatus.outcome !== bStatus.outcome) {
        statusChanges.push(bStatus)
      }
    }
  })

  return statusChanges
}

export const updateAddressData = async (address: Address) => {
  const binRepository = AppDataSource.getRepository(Bin)
  const binCollectionRepository = AppDataSource.getRepository(BinCollection)
  const binStatusRepository = AppDataSource.getRepository(BinStatus)
  const collectionDates = await findCollectionDates(address)
  const statuses: BinStatus[] = []
  const collections: BinCollection[] = []

  const storableBins = await Promise.all(collectionDates.map(async (collectionDate) => {
    const cd = binRepository.create({
      id: collectionDate.id,
      type: collectionDate.type,
    })
    if (collectionDate.status) {
      const status = binStatusRepository.create(collectionDate.status)
      status.bin = cd
      statuses.push(status)
    }
    const collectionDates = collectionDate.collections.map(date => 
      binCollectionRepository.create({
        date,
        bin: cd,
      })
    )
    binRepository.merge(cd, {
      address,
    })
    collections.push(...collectionDates)
    return cd
  }))

  const bins = await binRepository.save(storableBins)
  // get current status for each bin
  const currentStatuses = await binStatusRepository.find({
    where: {
      bin: {
        id: In(storableBins.map(b => b.id)),
      },
    },
    relations: ['bin'],
  })
  
  await binStatusRepository.save(statuses)
  // get new status for each bin
  const newStatuses = await binStatusRepository.find({
    where: {
      bin: {
        id: In(storableBins.map(b => b.id)),
      },
    },
    relations: ['bin'],
  })
  await binCollectionRepository.save(collections)

  const changedStatuses = diffStatuses(bins, currentStatuses, newStatuses)

  await AppDataSource.getRepository(Address).update(address.id, {
    lastUpdatedAt: new Date(),
  })

  return {
    changedStatuses,
  }
}

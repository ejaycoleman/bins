import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { AppDataSource } from '../data-source'
import { Bin, BinCollection, BinStatus } from '../entities'
import { Address } from '../entities/address'
import { Device } from '../entities/device'

@Resolver(Device)
export class NotificationResolver {
  @Mutation(() => Device)
  async enableNotifications(@Arg('token') token: string, @Arg('addressId') addressId: string): Promise<Device> {
    const deviceRepository = AppDataSource.getRepository(Device)
    const addressRepository = AppDataSource.getRepository(Address)
    const address = await addressRepository.findOneOrFail({
      where: {
        id: addressId,
      },
      relations: ['devices'],
    })
    const existing = await deviceRepository.findOne({
      where: {
        token,
      },
    })
    if (existing) {
      return existing
    }
    const d = deviceRepository.create({
      token,
    })
    address.devices = [...(address.devices || []), d]
    const device = await deviceRepository.save(d)
    await addressRepository.save(address)

    return device
  }

  @Mutation(() => Boolean)
  async disableNotifications(@Arg('token') token: string): Promise<boolean> {
    const deviceRepository = AppDataSource.getRepository(Device)
    const device = await deviceRepository.findOne({
      where: {
        token,
      },
      relations: ['address', 'address.devices', 'address.bins'],
    })

    if (!device) {
      return false
    }

    // last one out close the door
    if (device.address?.devices?.length === 1) {
      // delete bins
      const bins = device.address?.bins || []
      for (const bin of bins) {
        // remove collections  
        await AppDataSource.getRepository(BinCollection).delete({
          bin: {
            id: bin.id,
          },
        })
        // remove statuses
        await AppDataSource.getRepository(BinStatus).delete({
          bin: {
            id: bin.id,
          },
        })
        // remove bin
        await AppDataSource.getRepository(Bin).remove(bin)
      }
      await AppDataSource.getRepository(Address).remove(device.address)
    }

    await deviceRepository.remove(device)

    return true
  }

  @Query(() => Device)
  async getDevice(@Arg('token') token: string): Promise<Device> {
    const deviceRepository = AppDataSource.getRepository(Device)
    const device = await deviceRepository.findOneOrFail({
      where: {
        token,
      },
      relations: ['address', 'address.devices', 'address.bins'],
    })

    return device
  }
}

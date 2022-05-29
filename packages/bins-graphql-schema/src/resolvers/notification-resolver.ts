import { Arg, Mutation, Resolver } from 'type-graphql'
import { AppDataSource } from '../data-source'
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
    const d = deviceRepository.create({
      token,
    })
    address.devices = [...(address.devices || []), d]
    const device = await deviceRepository.save(d)
    await addressRepository.save(address)

    return device
  }
}

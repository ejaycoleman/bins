import assert from 'assert'

import { parseHtml } from '../src/bin-collection/find-collection-dates'
import { existsHtml } from './html/exists'
import { notExistsHtml } from './html/not-exists'

const expected = [
  {
    binType: 'Refuse',
    collectionDates: [
      new Date('2022-06-21T00:00:00.000Z'),
      new Date('2022-06-28T00:00:00.000Z'),
      new Date('2022-07-05T00:00:00.000Z'),
      new Date('2022-07-12T00:00:00.000Z'),
      new Date('2022-07-19T00:00:00.000Z'),
      new Date('2022-07-26T00:00:00.000Z'),
    ]
  },
  {
    binType: 'Recycling',
    collectionDates: [
      new Date('2022-06-21T00:00:00.000Z'),
      new Date('2022-07-05T00:00:00.000Z'),
      new Date('2022-07-19T00:00:00.000Z'),
      new Date('2022-08-02T00:00:00.000Z'),
      new Date('2022-08-16T00:00:00.000Z'),
      new Date('2022-08-30T00:00:00.000Z'),
    ]
  },
  {
    binType: 'Glass',
    collectionDates: [
      new Date('2022-06-21T00:00:00.000Z'),
      new Date('2022-07-05T00:00:00.000Z'),
      new Date('2022-07-19T00:00:00.000Z'),
      new Date('2022-08-02T00:00:00.000Z'),
      new Date('2022-08-16T00:00:00.000Z'),
      new Date('2022-08-30T00:00:00.000Z'),
    ]
  },
  {
    binType: 'GardenWaste',
    collectionDates: [
      new Date('2022-06-28T00:00:00.000Z'),
      new Date('2022-07-12T00:00:00.000Z'),
      new Date('2022-07-26T00:00:00.000Z'),
      new Date('2022-08-09T00:00:00.000Z'),
      new Date('2022-08-23T00:00:00.000Z'),
    ]
  }
]

describe('parseHtml', () => {
  it('should return collection dates for a valid html', async () => {
    const result = parseHtml(existsHtml)
    assert.deepEqual(result, expected)
  })
  it('should return collection an empty array for valid but empty html', async () => {
    const result = parseHtml(notExistsHtml)
    assert.deepEqual(result, [])
  })
})
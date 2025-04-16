export const mockData = {
  getPaymentInfo: {
    data: {
      totalAmount: 7250000,
      lastMonthAmount: 3500000,
      list: [
        {
          id: 1,
          tutorID: 'T123',
          orderCode: 'ORD-001',
          amount: 500000,
          status: 'Completed',
          createdAt: '2024-03-01T10:00:00Z'
        },
        {
          id: 2,
          tutorID: 'T456',
          orderCode: 'ORD-002',
          amount: 750000,
          status: 'Pending',
          createdAt: '2024-03-05T15:30:00Z'
        },
        {
          id: 3,
          tutorID: 'T789',
          orderCode: 'ORD-003',
          amount: 1000000,
          status: 'Failed',
          createdAt: '2024-03-10T09:20:00Z'
        },
        {
          id: 4,
          tutorID: 'T321',
          orderCode: 'ORD-004',
          amount: 1500000,
          status: 'Completed',
          createdAt: '2024-04-01T12:00:00Z'
        },
        {
          id: 5,
          tutorID: 'T654',
          orderCode: 'ORD-005',
          amount: 200000,
          status: 'Completed',
          createdAt: '2024-04-03T14:45:00Z'
        },
        {
          id: 6,
          tutorID: 'T987',
          orderCode: 'ORD-006',
          amount: 900000,
          status: 'Pending',
          createdAt: '2024-04-05T11:10:00Z'
        },
        {
          id: 7,
          tutorID: 'T246',
          orderCode: 'ORD-007',
          amount: 1200000,
          status: 'Completed',
          createdAt: '2024-04-08T16:30:00Z'
        }
      ]
    }
  },
  'admin/getActiveUser': {
    data: {
      totalCount: 150,
      createLastMonthCount: 12,
      users: [
        {
          id: 'U001',
          fullName: 'Nguyễn Văn A',
          createdAt: '2024-04-02T09:00:00Z'
        },
        {
          id: 'U002',
          fullName: 'Trần Thị B',
          createdAt: '2024-04-03T11:00:00Z'
        },
        {
          id: 'U003',
          fullName: 'Lê Văn C',
          createdAt: '2024-03-28T15:30:00Z'
        }
      ]
    }
  }
}

import { Table, Tag } from 'antd';

export default function AppointmentTable({ data, onStatus }) {
  const cols = [
    { title: 'Doctor', dataIndex: ['doctorId', 'name'] },
    { title: 'Specialty', dataIndex: ['doctorId', 'specialty'] },
    { title: 'Date', dataIndex: 'date' },
    { title: 'Time', dataIndex: 'time' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: s => (
        <Tag color={s === 'confirmed' ? 'green' : s === 'cancelled' ? 'red' : 'gold'}>
          {s.toUpperCase()}
        </Tag>
      )
    },
    ...(onStatus
      ? [
          {
            title: 'Action',
            render: (_, r) => (
              <>
                <a onClick={() => onStatus(r._id, 'confirmed')}>Confirm&nbsp;</a>|
                <a onClick={() => onStatus(r._id, 'cancelled')}>&nbsp;Cancel</a>
              </>
            )
          }
        ]
      : [])
  ];
  return <Table rowKey="_id" columns={cols} dataSource={data} />;
}

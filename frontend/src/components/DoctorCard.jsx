import { Card, Tag, Button } from 'antd';

export default function DoctorCard({ doc, onBook }) {
  return (
    <Card
      title={doc.name}
      extra={<Tag color="blue">{doc.specialty}</Tag>}
      style={{ marginBottom: 16 }}
    >
      <p>{doc.location}</p>
      <p>{doc.contact}</p>
      {onBook && (
        <Button type="primary" onClick={() => onBook(doc)}>
          Book Appointment
        </Button>
      )}
    </Card>
  );
}

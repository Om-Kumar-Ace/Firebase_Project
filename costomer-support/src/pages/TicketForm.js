import React, { useState } from 'react';
import { firestore } from '../Firebase';
import { Input, Button, Textarea, Dropdown, Checkbox } from '@nextui-org/react';

const TicketForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await firestore.collection('tickets').add({
      title,
      description,
      priority,
      category,
      contactEmail,
      phone,
      attachment,
      createdBy: auth.currentUser.uid,
      status: 'Open',
      createdAt: new Date(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Dropdown label="Priority" onChange={(e) => setPriority(e)}>
        <Dropdown.Item value="Low">Low</Dropdown.Item>
        <Dropdown.Item value="Medium">Medium</Dropdown.Item>
        <Dropdown.Item value="High">High</Dropdown.Item>
      </Dropdown>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default TicketForm;

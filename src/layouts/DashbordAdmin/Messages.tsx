import React from 'react';
import MessagePage from '../../components/dashboard/MessagePage';

export default function StudentMessages() {
  return (
    <MessagePage
      title="Messages étudiant"
      subtitle="Retrouvez vos échanges avec la scolarité, les enseignants et le support."
      audienceLabel="Dashboard étudiant"
    />
  );
}
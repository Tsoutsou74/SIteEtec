import React from 'react';
import MessagePage from '../../components/dashboard/MessagePage';

export default function AdminMessages() {
  return (
    <MessagePage
      title="Messages administration"
      subtitle="Gérez les échanges avec les étudiants, les enseignants et les services de l'établissement."
      audienceLabel="Dashboard administration"
    />
  );
}

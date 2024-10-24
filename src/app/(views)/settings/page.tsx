import React from 'react';
import UserForm from './userForm';
import { auth } from '@/lib/auth-config';
import { redirect } from 'next/navigation';

async function AdministrationPage() {
  const session = await auth();
  const role = session?.user.role;
  if (session && role !== 'ADMIN') {
    redirect('/home');
  }
  return <UserForm />;
}

export default AdministrationPage;

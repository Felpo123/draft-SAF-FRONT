'use server';

import { formSchema } from '@/app/(views)/settings/userForm';
import { z } from 'zod';

type FormData = z.infer<typeof formSchema>;

export async function registerUser(formData: FormData) {
  const { username, password, role } = formData;

  const authCredentials = btoa('admin:geoserver');

  try {
    // First POST request to create user
    const createUserResponse = await fetch(
      'http://192.168.1.116:8080/geoserver/rest/security/usergroup/users',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          Authorization: `Basic ${authCredentials}`,
        },
        body: `<user>
            <userName>${username}</userName>
            <password>${password}</password>
            <enabled>true</enabled>
        </user> 
        `,
      }
    );

    if (createUserResponse.status !== 201) {
      throw new Error(
        `Failed to create user. Status: ${createUserResponse.status}`
      );
    }

    // Second POST request to assign role
    const assignRoleResponse = await fetch(
      `http://192.168.1.116:8080/geoserver/rest/security/roles/role/${role}/user/${username}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authCredentials}`,
        },
      }
    );

    if (assignRoleResponse.status !== 200) {
      throw new Error(`Failed to assign role. Status: ${assignRoleResponse}`);
    }

    return {
      success: true,
      message: `Usuario ${username} registrado exitosamente como ${role}`,
    };
  } catch (error) {
    console.error('Error during user registration:', error);
    return {
      success: false,
      errors: {
        server: [
          'Error al registrar el usuario. Por favor, inténtelo de nuevo.',
        ],
      },
    };
  }
}

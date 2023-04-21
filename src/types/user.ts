type MiddelewareAuthDTO = {
  email: string;
  id: number;
};

export type RegistrationDTO = {
  body: {
    firstName: string;
    lastName: string;
    userEmail: string;
    password: string;
  };
};

export type AuthorizationDTO = {
  body: {
    email: string;
    password: string;
  };
};

export type UpdateUserDTO = {
  body: { email: string; firstName: string; lastName: string };
  user: MiddelewareAuthDTO;
};

export type UpdatePasswordDTO = {
  user: MiddelewareAuthDTO;
  body: {
    oldPassword: string;
    newPassword: string;
    repeatNewPassword: string;
  };
};

export type FindAllUsersDTO = {
  userPermission: string[];
};

export type DropUserDto = {
  user: MiddelewareAuthDTO;
};

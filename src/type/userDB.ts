interface UserDBType {
  name: String;
  userID: String;
  userType: String;
  email: String;
  password: String;
  totalUrl: Number;
  tokens: {
    tokens: String;
  }[];
}

export default UserDBType;

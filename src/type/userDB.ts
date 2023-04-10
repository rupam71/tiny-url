interface UserDBType {
  name: String;
  userID: String;
  status: String;
  email: String;
  password: String;
  totalUrl: Number;
  tokens: {
    tokens: String;
  }[];
}

export default UserDBType;

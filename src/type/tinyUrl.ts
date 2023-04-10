interface TinyUrlType {
  longUrl: String;
  shortUrl: String;
  totalHit: Number;
  expireAt: Date;
  user: {
    name: String;
    status: String;
  };
}

export default TinyUrlType;

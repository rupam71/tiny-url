interface TinyUrlType {
  longUrl: String;
  shortUrl: String;
  endTime: Date;
  totalHit: Number;
  expireAt: Date;
  user: {
    name: String;
    status: String;
  };
}

export default TinyUrlType;

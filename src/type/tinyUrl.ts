interface TinyUrlType {
  longUrl: String;
  shortUrl: String;
  endTime: Date;
  totalHit: Number;
  user: {
    name: String;
    status: String;
  };
}

export default TinyUrlType;

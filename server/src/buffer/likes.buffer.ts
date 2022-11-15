import { Filter, ObjectId, UpdateFilter } from "mongodb";
import { useDatabase } from "../hooks/useDatabase";

type Prefix = 'receipt' | 'article' | 'category';

class LikeBuffer {
  private _prefix: Prefix;
  private _buffer: Map<string, number> = new Map();

  constructor(prefix: Prefix) {
    console.log('Init Likes buffer for', prefix);
    this._prefix = prefix;
    this.startTimer(50);
  }

  public getLikes () {
    return this._buffer
  }

  public like(objectId: string) {
    const isObjectExists = this._buffer.get(objectId);
    if (isObjectExists) {
      console.log('Increment likes in buffer', isObjectExists);
      this._buffer.set(objectId, isObjectExists + 1);
      return;
    }
    console.log('Add new element in Buffer', objectId);
    this._buffer.set(objectId, 1);
  }

  private startTimer(seconds: number) {
    return setInterval(async () => {
      if (!this._buffer.size) {
        console.log(this._prefix, 'Likes buffer is empty - skip');
        return
      }
      console.log('Total items to like -', this._buffer);
      const data = Array.from(this._buffer.entries());
      this._buffer.clear();

      const chunkSize = 50;
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        await Promise.all(chunk.map(async (bufferedItem: [string, number]) => {
          try {
            const filter: Filter<any> = { _id: new ObjectId(bufferedItem[0]) };
            const update: UpdateFilter<articles.IDBArticles> = { $inc: { likes: bufferedItem[1] } };
  
            if (this._prefix === 'article') {
              await useDatabase.articlesDatabase.updateOne(filter, update)
            }
            if (this._prefix === 'category') {
              await useDatabase.categoriesDatabase.updateOne(filter, update)
            }
            if (this._prefix === 'receipt') {
              await useDatabase.receiptsDatabase.updateOne(filter, update)
            }
          } catch (err) {
            console.error('Error while like', err);
            return;
          }
        }))
      }
    }, seconds * 1000)
  }
  
  
}

export default LikeBuffer
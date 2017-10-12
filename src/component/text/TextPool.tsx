export class TextPool {
  private map: {[key: string]: string} = Object.create(null);

  private id: number = 0;

  private readonly prefix: string = 'text_';

  public put(text: string): string {
    const existingId = this.getId(text);
    if (existingId) {
      return existingId;
    }
    const id = this.nextId();
    this.map[text] = id;

    return id;
  }

  public getId(text: string): string {
    const id = this.map[text];

    return id;
  }

  private nextId(): string {
    this.id++;

    return this.prefix + String(this.id);
  }
}

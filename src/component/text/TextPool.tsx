export class TextPool {
  private map: {[key: string]: string} = {};

  private id: number = 0;

  private prefix: string = 'text_';

  public put(text: string): string {
    const id = this.nextId();
    this.map[text] = id;

    return id;
  }

  public get(text: string): string {
    const pooledText = this.map[text];

    return pooledText;
  }

  private nextId(): string {
    this.id++;

    return this.prefix + String(this.id);
  }
}

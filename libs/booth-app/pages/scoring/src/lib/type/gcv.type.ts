export interface Vertex {
  x: number;
  y: number;
}

export interface BoundingPoly {
  vertices: Vertex[];
}

export interface TextAnnotation {
  locale: string;
  description: string;
  boundingPoly: BoundingPoly;
}

export interface DetectedLanguage {
  languageCode: string;
  confidence: number;
}

export interface DetectedBreak {
  type: string;
  isPrefix: boolean;
}

export interface ISymbol {
  property: TextProperty;
  boundingBox: BoundingPoly;
  text: string;
  confidence: number;
}

export interface Word {
  property: TextProperty;
  boundingBox: BoundingPoly;
  symbols: ISymbol[];
  confidence: number;
}

export interface TextProperty {
  detectedLanguages: DetectedLanguage[];
  detectedBreak?: DetectedBreak;
}

export interface Paragraph {
  property: TextProperty;
  boundingBox: BoundingPoly;
  words: Word[];
  confidence: number;
}

export interface Block {
  property: TextProperty;
  boundingBox: BoundingPoly;
  paragraphs: Paragraph[];
  blockType: string;
  confidence: number;
}


export interface Page {
  property: TextProperty;
  width: number;
  height: number;
  blocks: Block[];
  confidence: number;
}

export interface FullTextAnnotation {
  pages: Page[];
  text: string;
}

export interface AnnotateImageResponse {
  textAnnotations?: TextAnnotation[];
  fullTextAnnotation?: FullTextAnnotation
}
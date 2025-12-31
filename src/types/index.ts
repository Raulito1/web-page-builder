export interface ProjectConfig {
    useRouter: boolean;
    useRTKQuery: boolean;
  }
  
  export interface ComponentShape {
    id: string;
    type: 'text' | 'button' | 'input' | 'image' | 'container';
    x: number;
    y: number;
    width: number;
    height: number;
    content?: string;
    styles?: React.CSSProperties;
  }
  
  export interface Template {
    id: string;
    name: string;
    thumbnail: string;
    components: ComponentShape[];
  }
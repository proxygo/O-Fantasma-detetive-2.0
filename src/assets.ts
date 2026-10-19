const urls = {
  library: new URL('./assets/game/library-v1.png', import.meta.url).href,
  characterAtlas: new URL('./assets/game/capitio-desenho-autoral-v1.png', import.meta.url).href,
  ghostBodyAtlas: new URL('./assets/game/capitio-corpo-espectral-v1.png', import.meta.url).href,
  props: new URL('./assets/game/props-v1.png', import.meta.url).href,
};
export const art: Partial<Record<keyof typeof urls, HTMLImageElement>> = {};
export async function loadArt() {
  await Promise.all(Object.entries(urls).map(([key,url])=>new Promise<void>((resolve,reject)=>{
    const image=new Image();
    image.onload=()=>{art[key as keyof typeof urls]=image;resolve();};
    image.onerror=()=>reject(new Error('Não foi possível carregar '+key));
    image.src=url;
  })));
}


export const entrepreneurPhotos: Record<string, string> = {
  "Rony": "/entrepreneurs/rony.png",
  "Renata": "/entrepreneurs/renata.png",
  "Sandra": "/entrepreneurs/sandra.png",
  "Tallis": "/entrepreneurs/tallis.png",
  "Natalia": "/entrepreneurs/natalia.png",
};

export const getPhotoByName = (name: string): string | null => {
  for (const key of Object.keys(entrepreneurPhotos)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return entrepreneurPhotos[key];
  }
  return null;
};

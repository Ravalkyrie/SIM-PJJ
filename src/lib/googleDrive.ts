/**
 * Helper to upload a file to Google Drive using the Drive API v3
 */
export interface DriveUploadResponse {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
}

export const uploadFileToDrive = async (
  file: File,
  accessToken: string
): Promise<DriveUploadResponse> => {
  const metadata = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
  };

  const formData = new FormData();
  formData.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  formData.append('file', file);

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Drive upload error:', errorText);
    throw new Error(`Google Drive Upload Gagal: ${response.statusText} (${response.status})`);
  }

  const data = await response.json();
  return data as DriveUploadResponse;
};

/**
 * Helper to delete a file from Google Drive (Requires confirmation in UI)
 */
export const deleteFileFromDrive = async (
  fileId: string,
  accessToken: string
): Promise<void> => {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text();
    console.error('Drive delete error:', errorText);
    throw new Error(`Google Drive Delete Gagal: ${response.statusText}`);
  }
};

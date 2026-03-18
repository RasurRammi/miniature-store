import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useUploadAssets() {
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (files: File[]) => {
      const origin = window.location.origin

      const operations = JSON.stringify({
        query: `
          mutation CreateAssets($input: [CreateAssetInput!]!) {
            createAssets(input: $input) {
              ... on Asset { id name preview source }
              ... on MimeTypeError { errorCode message }
            }
          }
        `,
        variables: {
          input: files.map(() => ({ file: null })),
        },
      })

      const map = JSON.stringify(
        Object.fromEntries(
          files.map((_, i) => [String(i), [`variables.input.${i}.file`]]),
        ),
      )

      const formData = new FormData()
      formData.append('operations', operations)
      formData.append('map', map)
      files.forEach((file, i) => formData.append(String(i), file))

      // no content-type header
      const response = await fetch(`${origin}/api/admin`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      const json = await response.json()
      if (json.errors?.length) throw new Error(json.errors[0]?.message ?? 'Upload failed')
      return json.data.createAssets
    },
    onSuccess: (result: File[]) => {
      console.log(result)
      toast.add({
        title: 'Files successfully uploaded',
        description: `Successfully uploaded ${result.length} files`,
        color: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

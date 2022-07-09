export function success(dispatch, action) {
  dispatch(action({
    loading: false,
    status: true,
    error: null
  }))
} 

export function fail(dispatch, action, error) {
   dispatch(
        action({
          loading: false,
          status: false,
          error: error.response.data.error,
        })
      );
}
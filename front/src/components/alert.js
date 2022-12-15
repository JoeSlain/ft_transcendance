const Alert = ({ message, setError }) => {
    console.log('message', message)

    setTimeout(() => {
        setError(null)
      }, 5000)

    if (message) {
        return (
            <div className='error'>
                {message}
            </div>
        )
    }
    console.log('alert null')
    return null;
}

export default Alert;
namespace ThaoPham.Web.Business.LifeStyles
{
    public class LifestyleResult<T>
        where T : class
    {
        public LifestyleResult()
        {
        }

        public LifestyleResult(T resultData)
        {
            Success = true;
            ResultData = resultData;
        }

        public LifestyleResult(string error, string errorMessage)
        {
            Success = false;
            Error = error;
            ErrorMessage = errorMessage;
        }

        public bool Success { get; private set; }

        public string Error { get; private set; }

        public string ErrorMessage { get; private set; }

        public T ResultData { get; private set; }

        public bool TryGetResultData(out T result)
        {
            if (Success && ResultData != null)
            {
                result = ResultData;
                return true;
            }

            result = default;
            return false;
        }

        public override string ToString()
        {
            return $"Success: {Success}, ResultData: {ResultData}, Error: {Error}, ErrorMessage: {ErrorMessage}";
        }
    }
}

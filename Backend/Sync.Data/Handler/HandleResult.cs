namespace ThaoPham.Web.Business.LifeStyles
{
    public class HandleResult<T>
        where T : class
    {
        public HandleResult()
        {
        }

        public HandleResult(T resultData)
        {
            IsValidEmail = true;
            HasSharedEmail = false;
            ResultData = resultData;
        }

        public HandleResult(T resultData, bool isValidEmail = true, bool hasSharedEmail =false, bool isError =false, bool noMerge=false)
        {
            IsValidEmail = isValidEmail;
            HasSharedEmail = hasSharedEmail;
            IsError = isError;
            ResultData = resultData;
            NoMerge = noMerge;
        }

        public bool IsValidEmail { get; private set; }
        public bool HasSharedEmail { get; private set; }
        public bool IsError { get; private set; }
        public bool NoMerge { get; private set; }
        public T ResultData { get; private set; }
    }
}

import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const useCurrentUser = () => {
    //SWR will look and decide if data need to be re-validate and fetch again
    //Replace to global state as Redux
    const {data,error,isLoading,mutate} = useSWR('/api/current', fetcher)

    return {
        data,
        error,
        isLoading,
        mutate
    }
};

export default useCurrentUser;
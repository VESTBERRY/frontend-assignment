import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { GET_COMPANIES, CompanyType } from "./graphql.ts";

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const LoadingDiv = styled.div`
  text-align: center;
`;

export function Page() {
  const { loading, error, data } = useQuery<{ companies: CompanyType[] }>(
    GET_COMPANIES,
  );

  if (loading) {
    return <LoadingDiv>Loading data...</LoadingDiv>;
  }

  if (error) {
    return (
      <span>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </span>
    );
  }

  const companies = data?.companies;

  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>company name</th>
            <th>stage</th>
            <th>sector</th>
            <th>investment size</th>
          </tr>
        </thead>
        <tbody>
          {companies?.length &&
            companies?.map((company) => (
              <tr>
                <td>{company.name}</td>
                <td>{company.stage}</td>
                <td>{company.sector}</td>
                <td>{company.investmentSize}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Container>
  );
}

export default Page;

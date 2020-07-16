import { lookup } from "dns";

import { lookupABN, getHistory, searchActive } from ".";

describe("Lookup tests", () => {
  it.each`
    abnOrAcn            | name                                                 | gst
    ${"006912563"}      | ${"a"}                                               | ${"registered"}
    ${"75 846 826 742"} | ${"COLES, ADRIAN STAN"}                              | ${"Not currently registered for GST"}
    ${"48 123 123 124"} | ${"COMMONWEALTH BANK"}                               | ${"registered"}
    ${"35 460 201 920"} | ${"K.L CHOW & K.F HWANG & H WONG"}                   | ${"not registered"}
    ${"15 035 513 435"} | ${"BAROSSA GRAPE AND WINE ASSOCIATION INCORPORATED"} | ${"Registered"}
  `(
    "should retrieve ABN information for ACN: $abnOrAcn , name: $name , gst: $gst",
    async ({ abnOrAcn }) => {
      const data = await lookupABN(abnOrAcn);
      expect(data).toMatchSnapshot();
    }
  );
  it("45 004 189 708 should match with snapshot", async () => {
    const data = await lookupABN("45 004 189 708");
    expect(data).toMatchSnapshot();
  });
});

describe("History tests", () => {
  it.each`
    abnOrAcn            | name                                                 | gst
    ${"45 004 189 708"} | ${"a"}                                               | ${"registered"}
    ${"006912563"}      | ${"a"}                                               | ${"registered"}
    ${"75 846 826 742"} | ${"COLES, ADRIAN STAN"}                              | ${"Not currently registered for GST"}
    ${"48 123 123 124"} | ${"COMMONWEALTH BANK"}                               | ${"registered"}
    ${"35 460 201 920"} | ${"K.L CHOW & K.F HWANG & H WONG"}                   | ${"not registered"}
    ${"15 035 513 435"} | ${"BAROSSA GRAPE AND WINE ASSOCIATION INCORPORATED"} | ${"Registered"}
  `(
    "should get histories data match with snapshots - $abnOrAcn",
    async ({ abnOrAcn }) => {
      const data = await getHistory(abnOrAcn);
      expect(data).toMatchSnapshot();
    }
  );
});

describe("searchActive()", () => {
  it.each`
    keyword                  | abnOrAcn            | name                     | type               | location
    ${"Toy World Australia"} | ${"43 165 614 120"} | ${"Toy World Australia"} | ${"Business Name"} | ${"3754 VIC"}
    ${"Racing"}              | ${" 883 267"}       | ${"RACING.COM PTY LTD"}  | ${"Entity Name"}   | ${"3008 VIC"}
  `(
    "should get the list company match with snapshot of '$keyword'",
    async ({ keyword }) => {
      const data = await searchActive(keyword);
      expect(data).toMatchSnapshot();
    }
  );
});

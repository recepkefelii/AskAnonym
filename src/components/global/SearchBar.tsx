"use client";

import { Combobox } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function SearchBar() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [personList, setPersonList] = useState<
    { username: any; avatar_url: any }[]
  >([]);

  function goProfile(username: string) {
    router.push(`/${username}`);
  }

  async function setSearchQuery(value: string) {
    const { data } = await supabase
      .from("profiles")
      .select("username,avatar_url")
      .ilike("username", `%${value}%`)
      .limit(5);
    setPersonList(data ? data : []);
  }

  return (
    <div className="flex items-center px-6 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
      <div className="w-full">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <Combobox value="" onChange={goProfile}>
            <Combobox.Input
              placeholder="Search"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-gray-500 focus:border-purple-700 focus:text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-700 focus:placeholder:text-gray-400 sm:text-sm"
              onChange={e => {
                setSearchQuery(e.target.value);
              }}
            ></Combobox.Input>
            <Combobox.Options className="absolute w-full rounded-md border border-gray-300 bg-white py-2 px-3">
              {personList.map(person => (
                <Combobox.Option
                  className="border-b border-gray-100 py-2"
                  key={person["username"]}
                  value={person["username"]}
                >
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={person.avatar_url}
                        alt={person.username}
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="cursor-pointer text-sm font-medium text-gray-900">
                        {person.username}
                      </p>
                    </div>
                  </div>
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;

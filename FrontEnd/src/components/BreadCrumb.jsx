import React from 'react';
import { Breadcrumbs } from "@material-tailwind/react";
import { Link } from 'react-router-dom';

const BreadcrumbsWithIcon = ({ pathnames }) => {
  return (
    <Breadcrumbs className=" bg-orange-500 mt-5">
      <Link to="/" className="opacity-60">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      </Link>
      {pathnames.slice(1).map((value, index) => {
        const to = `/${pathnames.slice(1, index + 2).join('/')}`;

        return index === pathnames.length - 2 ? (
          <span key={to}>{value}</span>
        ) : (
          <Link key={to} to={to} className="opacity-60">
            {value}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsWithIcon;

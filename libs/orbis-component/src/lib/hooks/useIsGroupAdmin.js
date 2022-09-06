import React, { useState, useEffect, useRef } from 'react';
import { cleanCryptoAccounts } from "../utils";

export default function useIsGroupAdmin(user, group) {
  let _isAdmin = false;
  if(user && group && (user.did == group.creator)) {
    _isAdmin = true;
  }

  return _isAdmin;
}

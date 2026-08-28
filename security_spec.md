# Security Specification & Test Payloads

## 1. Data Invariants
1. A User document at `/users/{userId}` can only be created or modified by the user where `request.auth.uid == userId`.
2. A Guestbook entry at `/guestbook/{entryId}` can only be created by an authenticated user whose `authorId == request.auth.uid`.
3. Guestbook messages cannot exceed 600 characters and must have a valid role ('Recruiter', 'Client', 'Engineer', 'Collaborator', 'Visitor').
4. A User can delete their own guestbook entry, but cannot modify another user's entry.
5. Inquiries at `/inquiries/{inquiryId}` require valid name, email, and message strings within strict size bounds.
6. Chat messages under `/users/{userId}/chatHistory/{messageId}` strictly require `request.auth.uid == userId`.

## 2. The Dirty Dozen Payloads
1. **User Profile Hijacking**: Unauthenticated write to `/users/victim_123` -> Denied.
2. **User Impersonation on Profile**: Authenticated as `attacker_456` trying to write to `/users/victim_123` -> Denied.
3. **Guestbook Spoofed Author ID**: User `user_1` writes a guestbook entry with `authorId: 'user_2'` -> Denied.
4. **Guestbook Unauthenticated Post**: An unauthenticated user writes to `/guestbook/entry_1` -> Denied.
5. **Guestbook Oversized Message**: User sends a 50,000-character payload in `message` -> Denied.
6. **Guestbook Role Injection**: User sends `role: 'SuperAdmin'` outside allowed enum -> Denied.
7. **Guestbook Tampering**: User `attacker` tries to delete or edit `victim`'s guestbook entry -> Denied.
8. **Inquiry Denial-of-Wallet**: Sending a 10MB junk payload to `/inquiries` -> Denied.
9. **Inquiry Path Traversal / Poisoned ID**: Submitting to an ID with illegal characters -> Denied.
10. **Chat History Hijack**: User `attacker` reads `/users/victim/chatHistory` -> Denied.
11. **Chat History Spoofing**: User writes a chat message with a mismatching `userId` field -> Denied.
12. **Public User Listing**: An unauthenticated or standard user executing `list` over `/users` -> Denied.

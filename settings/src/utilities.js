import { useSelect } from '@wordpress/data';
import { store as coreDataStore, useEntityRecord } from '@wordpress/core-data';

/**
 * Fetch the user record.
 */
export function getUserRecord( userId ) {
	let userRecord = useEntityRecord( 'root', 'user', userId );

	// Polyfill in isSaving.
	if ( undefined === userRecord.isSaving ) {
		userRecord.isSaving = useSelect( ( select ) => select( coreDataStore ).isSavingEntityRecord( 'root', 'user', userId ) );
	}

	return userRecord;
}

/**
 * Refresh a `useEntityRecord` object from the REST API.
 *
 * This is necessary after an the underlying data in the database has been changed by a method other than
 * `record.save()`. When that happens, the `record` object isn't automatically updated, and needs to be manually
 * refreshed to get the latest data.
 *
 * todo open gutenberg issue to add something like this to the hook itself.
 *
 * @param record An record object that was generated by `useEntityRecord()`.
 */
export function refreshRecord( record ) {
	// The fake key will be ignored by the REST API because it isn't a registered field. But the request will still
	// result in the latest data being returned.
	record.edit( { 'refreshRecordFakeKey': '' } );
	record.save();
}
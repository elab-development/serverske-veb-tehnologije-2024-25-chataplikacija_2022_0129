import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ConversationController::listByUser
 * @see app/Http/Controllers/ConversationController.php:12
 * @route '/api/conversations/by-user'
 */
export const listByUser = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: listByUser.url(options),
    method: 'post',
})

listByUser.definition = {
    methods: ["post"],
    url: '/api/conversations/by-user',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConversationController::listByUser
 * @see app/Http/Controllers/ConversationController.php:12
 * @route '/api/conversations/by-user'
 */
listByUser.url = (options?: RouteQueryOptions) => {
    return listByUser.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConversationController::listByUser
 * @see app/Http/Controllers/ConversationController.php:12
 * @route '/api/conversations/by-user'
 */
listByUser.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: listByUser.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ConversationController::listByUser
 * @see app/Http/Controllers/ConversationController.php:12
 * @route '/api/conversations/by-user'
 */
    const listByUserForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: listByUser.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ConversationController::listByUser
 * @see app/Http/Controllers/ConversationController.php:12
 * @route '/api/conversations/by-user'
 */
        listByUserForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: listByUser.url(options),
            method: 'post',
        })
    
    listByUser.form = listByUserForm
/**
* @see \App\Http\Controllers\ConversationController::searchByName
 * @see app/Http/Controllers/ConversationController.php:35
 * @route '/api/conversations'
 */
export const searchByName = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchByName.url(options),
    method: 'get',
})

searchByName.definition = {
    methods: ["get","head"],
    url: '/api/conversations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConversationController::searchByName
 * @see app/Http/Controllers/ConversationController.php:35
 * @route '/api/conversations'
 */
searchByName.url = (options?: RouteQueryOptions) => {
    return searchByName.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConversationController::searchByName
 * @see app/Http/Controllers/ConversationController.php:35
 * @route '/api/conversations'
 */
searchByName.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchByName.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConversationController::searchByName
 * @see app/Http/Controllers/ConversationController.php:35
 * @route '/api/conversations'
 */
searchByName.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: searchByName.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ConversationController::searchByName
 * @see app/Http/Controllers/ConversationController.php:35
 * @route '/api/conversations'
 */
    const searchByNameForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: searchByName.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ConversationController::searchByName
 * @see app/Http/Controllers/ConversationController.php:35
 * @route '/api/conversations'
 */
        searchByNameForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchByName.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ConversationController::searchByName
 * @see app/Http/Controllers/ConversationController.php:35
 * @route '/api/conversations'
 */
        searchByNameForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchByName.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    searchByName.form = searchByNameForm
const ConversationController = { listByUser, searchByName }

export default ConversationController
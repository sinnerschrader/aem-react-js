The goal is to render react in the brower/node alone.

1. For now use only one server call, which gets the cache for a dedicated component tree defined by resourcetype, path and selectors.
   This call already exists but relies on server rendering. Change ResourceComponent to use new API and merge with vanilla components.
2. Reimplement server call to only call js transforms for each component. Transform returns props and a list of children. The latter
   will also be tranformed and  added to the cache.
3. Deprecate Sling-API or make it asynchronuous. 
 
   


